import time
import logging
from typing import Optional, Dict, Any, Callable
from datetime import datetime, timedelta
import requests
from functools import wraps
from config import APIProviderConfig, config

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RateLimiter:
    """Simple rate limiter for API calls"""
    
    def __init__(self, max_requests: int, period: int):
        self.max_requests = max_requests
        self.period = period
        self.requests = []
    
    def wait_if_needed(self):
        """Wait if rate limit would be exceeded"""
        now = time.time()
        # Remove old requests outside the period
        self.requests = [req_time for req_time in self.requests if now - req_time < self.period]
        
        if len(self.requests) >= self.max_requests:
            wait_time = self.period - (now - self.requests[0])
            if wait_time > 0:
                logger.warning(f"Rate limit reached. Waiting {wait_time:.2f} seconds...")
                time.sleep(wait_time)
        
        self.requests.append(now)


class SimpleCache:
    """Simple in-memory cache for API responses"""
    
    def __init__(self, duration: int):
        self.duration = duration
        self.cache: Dict[str, tuple[Any, datetime]] = {}
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached value if not expired"""
        if key in self.cache:
            value, timestamp = self.cache[key]
            if datetime.now() - timestamp < timedelta(seconds=self.duration):
                return value
            else:
                del self.cache[key]
        return None
    
    def set(self, key: str, value: Any):
        """Set cached value with current timestamp"""
        self.cache[key] = (value, datetime.now())
    
    def clear(self):
        """Clear all cached values"""
        self.cache.clear()


class APIClient:
    """Base API client with retry, caching, and rate limiting"""
    
    def __init__(self, provider_config: Optional[APIProviderConfig] = None):
        self.provider = provider_config or config.get_provider()
        self.cache = SimpleCache(config.cache_duration) if config.enable_cache else None
        self.rate_limiter = RateLimiter(config.rate_limit_requests, config.rate_limit_period)
        self.session = requests.Session()
        self.session.headers.update(self.provider.get_headers())
    
    def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        params: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Make HTTP request with retry logic"""
        url = f"{self.provider.base_url}/{endpoint.lstrip('/')}"
        
        for attempt in range(self.provider.retry_attempts):
            try:
                self.rate_limiter.wait_if_needed()
                
                if config.log_api_calls:
                    logger.info(f"API Call [{self.provider.name}]: {method} {url}")
                
                response = self.session.request(
                    method=method,
                    url=url,
                    params=params,
                    timeout=self.provider.timeout,
                    **kwargs
                )
                
                response.raise_for_status()
                
                return response.json()
                
            except requests.exceptions.RequestException as e:
                logger.error(f"Attempt {attempt + 1}/{self.provider.retry_attempts} failed: {e}")
                
                if attempt < self.provider.retry_attempts - 1:
                    wait_time = 2 ** attempt  # Exponential backoff
                    logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    raise
    
    def get(
        self, 
        endpoint: str, 
        params: Optional[Dict[str, Any]] = None,
        use_cache: bool = True
    ) -> Dict[str, Any]:
        """Make GET request with optional caching"""
        # Generate cache key
        cache_key = f"{endpoint}:{str(params)}" if params else endpoint
        
        # Check cache
        if use_cache and self.cache:
            cached = self.cache.get(cache_key)
            if cached is not None:
                logger.info(f"Cache hit for: {cache_key}")
                return cached
        
        # Make request
        data = self._make_request("GET", endpoint, params=params)
        
        # Store in cache
        if use_cache and self.cache:
            self.cache.set(cache_key, data)
        
        return data
    
    def post(
        self, 
        endpoint: str, 
        data: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Make POST request"""
        return self._make_request("POST", endpoint, json=data, **kwargs)
    
    def clear_cache(self):
        """Clear all cached data"""
        if self.cache:
            self.cache.clear()
            logger.info("Cache cleared")


def with_fallback(*provider_names: str):
    """Decorator to try multiple providers in sequence"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_error = None
            
            for provider_name in provider_names:
                if not config.is_provider_available(provider_name):
                    logger.warning(f"Provider {provider_name} not available, skipping...")
                    continue
                
                try:
                    logger.info(f"Trying provider: {provider_name}")
                    provider = config.get_provider(provider_name)
                    client = APIClient(provider)
                    kwargs['client'] = client
                    return func(*args, **kwargs)
                except Exception as e:
                    last_error = e
                    logger.error(f"Provider {provider_name} failed: {e}")
            
            raise Exception(f"All providers failed. Last error: {last_error}")
        
        return wrapper
    return decorator
