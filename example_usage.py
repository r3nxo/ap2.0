"""
Example usage of the Football Data Service
Demonstrates how to use the API without hardcoding keys
"""

from datetime import date, datetime
from football_service import FootballDataService
from config import config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Main example function"""
    
    # Check configured providers
    print("\n=== Configured API Providers ===")
    providers = config.get_all_providers()
    for name, provider in providers.items():
        print(f"✓ {name}: {provider.base_url}")
    
    if not providers:
        print("❌ No API providers configured!")
        print("Please copy .env.example to .env and add your API keys")
        return
    
    print(f"\nDefault provider: {config.default_provider}")
    
    # Initialize service with default provider
    print("\n=== Initializing Service ===")
    service = FootballDataService()
    print(f"Using provider: {service.provider_name}")
    
    # Example 1: Get live matches
    print("\n=== Example 1: Live Matches ===")
    try:
        live_matches = service.get_live_matches()
        print(f"Found {len(live_matches)} live matches")
        
        for match in live_matches[:3]:  # Show first 3
            print(f"\n{match['home_team']['name']} vs {match['away_team']['name']}")
            print(f"Score: {match['score']['home']} - {match['score']['away']}")
            print(f"League: {match['league']['name']}")
            print(f"Status: {match['status']} ({match.get('minute', 0)}')")
    
    except Exception as e:
        logger.error(f"Error fetching live matches: {e}")
    
    # Example 2: Get matches by date
    print("\n=== Example 2: Matches by Date ===")
    try:
        today = date.today()
        matches = service.get_matches_by_date(today)
        print(f"Found {len(matches)} matches for {today}")
        
        for match in matches[:5]:  # Show first 5
            print(f"\n{match['home_team']['name']} vs {match['away_team']['name']}")
            print(f"League: {match['league']['name']}")
            print(f"Time: {match['date']}")
    
    except Exception as e:
        logger.error(f"Error fetching matches by date: {e}")
    
    # Example 3: Get leagues
    print("\n=== Example 3: Available Leagues ===")
    try:
        leagues = service.get_leagues(country="England")
        print(f"Found {len(leagues)} leagues in England")
        
        for league in leagues[:5]:  # Show first 5
            print(f"\n{league['name']} (ID: {league['id']})")
            print(f"Type: {league['type']}")
    
    except Exception as e:
        logger.error(f"Error fetching leagues: {e}")
    
    # Example 4: Using specific provider
    print("\n=== Example 4: Using Specific Provider ===")
    if config.is_provider_available("football-data"):
        try:
            service_fd = FootballDataService("football-data")
            print(f"Using provider: {service_fd.provider_name}")
            
            leagues = service_fd.get_leagues()
            print(f"Found {len(leagues)} leagues")
        
        except Exception as e:
            logger.error(f"Error with specific provider: {e}")
    else:
        print("football-data provider not configured")
    
    # Example 5: Cache demonstration
    print("\n=== Example 5: Cache Performance ===")
    try:
        print("First request (no cache)...")
        start = datetime.now()
        matches1 = service.get_matches_by_date(date.today())
        time1 = (datetime.now() - start).total_seconds()
        print(f"Time: {time1:.2f}s")
        
        print("\nSecond request (from cache)...")
        start = datetime.now()
        matches2 = service.get_matches_by_date(date.today())
        time2 = (datetime.now() - start).total_seconds()
        print(f"Time: {time2:.2f}s")
        print(f"Speed improvement: {(time1/time2):.1f}x faster")
    
    except Exception as e:
        logger.error(f"Error in cache demo: {e}")


def example_with_filters():
    """Example: Implementing filters based on live data"""
    
    print("\n=== Filter Implementation Example ===")
    
    service = FootballDataService()
    
    # Get live matches
    matches = service.get_live_matches()
    
    # Filter 1: High scoring games (3+ goals)
    high_scoring = [
        m for m in matches 
        if (m['score']['home'] + m['score']['away']) >= 3
    ]
    print(f"\nHigh scoring games: {len(high_scoring)}")
    
    # Filter 2: Close games (1 goal difference or less)
    close_games = [
        m for m in matches 
        if abs(m['score']['home'] - m['score']['away']) <= 1
    ]
    print(f"Close games: {len(close_games)}")
    
    # Filter 3: Specific league
    premier_league = [
        m for m in matches 
        if "premier" in m['league']['name'].lower()
    ]
    print(f"Premier League matches: {len(premier_league)}")
    
    # Filter 4: Second half (45+ minutes)
    second_half = [
        m for m in matches 
        if m.get('minute') and m['minute'] >= 45
    ]
    print(f"Second half matches: {len(second_half)}")
    
    # Display filtered results
    if high_scoring:
        print("\n--- High Scoring Games ---")
        for match in high_scoring[:3]:
            print(f"{match['home_team']['name']} {match['score']['home']} - "
                  f"{match['score']['away']} {match['away_team']['name']} "
                  f"({match.get('minute', 0)}')")


if __name__ == "__main__":
    main()
    example_with_filters()
