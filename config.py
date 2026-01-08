import os
from typing import Optional, Dict, Any
from dataclasses import dataclass
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


@dataclass
class APIProviderConfig:
    """Configuration for a specific API provider"""
    name: str
    api_key: str
    host: Optional[str]
    base_url: str
    timeout: int
    retry_attempts: int
    
    def get_headers(self) -> Dict[str, str]:
        """Generate headers based on provider type"""
        if self.host:  # RapidAPI style
            return {
                "X-RapidAPI-Key": self.api_key,
                "X-RapidAPI-Host": self.host
            }
        else:  # Standard API key in header
            return {
                "X-Auth-Token": self.api_key
            }


class APIConfig:
    """Central API configuration manager"""
    
    def __init__(self):
        self.timeout = int(os.getenv("API_TIMEOUT", "30"))
        self.retry_attempts = int(os.getenv("API_RETRY_ATTEMPTS", "3"))
        self.cache_duration = int(os.getenv("CACHE_DURATION", "300"))
        self.rate_limit_requests = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
        self.rate_limit_period = int(os.getenv("RATE_LIMIT_PERIOD", "3600"))
        self.enable_cache = os.getenv("ENABLE_CACHE", "true").lower() == "true"
        self.log_api_calls = os.getenv("LOG_API_CALLS", "true").lower() == "true"
        self.default_provider = os.getenv("DEFAULT_API_PROVIDER", "api-football")
        
        # Initialize providers
        self._providers = self._load_providers()
    
    def _load_providers(self) -> Dict[str, APIProviderConfig]:
        """Load all available API providers from environment"""
        providers = {}
        
        # API Football
        if os.getenv("API_FOOTBALL_KEY"):
            providers["api-football"] = APIProviderConfig(
                name="api-football",
                api_key=os.getenv("API_FOOTBALL_KEY", ""),
                host=os.getenv("API_FOOTBALL_HOST"),
                base_url=os.getenv("API_FOOTBALL_BASE_URL", ""),
                timeout=self.timeout,
                retry_attempts=self.retry_attempts
            )
        
        # Football Data
        if os.getenv("FOOTBALL_DATA_KEY"):
            providers["football-data"] = APIProviderConfig(
                name="football-data",
                api_key=os.getenv("FOOTBALL_DATA_KEY", ""),
                host=None,
                base_url=os.getenv("FOOTBALL_DATA_BASE_URL", ""),
                timeout=self.timeout,
                retry_attempts=self.retry_attempts
            )
        
        # The Sports DB
        if os.getenv("SPORTS_DB_KEY"):
            providers["sports-db"] = APIProviderConfig(
                name="sports-db",
                api_key=os.getenv("SPORTS_DB_KEY", "3"),
                host=None,
                base_url=os.getenv("SPORTS_DB_BASE_URL", ""),
                timeout=self.timeout,
                retry_attempts=self.retry_attempts
            )
        
        return providers
    
    def get_provider(self, provider_name: Optional[str] = None) -> APIProviderConfig:
        """Get configuration for a specific provider"""
        name = provider_name or self.default_provider
        
        if name not in self._providers:
            raise ValueError(f"Provider '{name}' not configured. Available: {list(self._providers.keys())}")
        
        return self._providers[name]
    
    def get_all_providers(self) -> Dict[str, APIProviderConfig]:
        """Get all configured providers"""
        return self._providers
    
    def is_provider_available(self, provider_name: str) -> bool:
        """Check if a provider is configured and available"""
        return provider_name in self._providers


# Global configuration instance
config = APIConfig()
