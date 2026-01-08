from typing import List, Dict, Any, Optional
from datetime import datetime, date
from api_client import APIClient, with_fallback
from config import config
import logging

logger = logging.getLogger(__name__)


class FootballDataService:
    """Service for fetching football data with provider abstraction"""
    
    def __init__(self, provider_name: Optional[str] = None):
        """
        Initialize service with a specific provider
        If no provider specified, uses default from config
        """
        self.client = APIClient(config.get_provider(provider_name))
        self.provider_name = self.client.provider.name
    
    # ============= Live Matches =============
    
    @with_fallback("api-football", "football-data", "sports-db")
    def get_live_matches(self, client: APIClient = None) -> List[Dict[str, Any]]:
        """Get all live matches"""
        if client.provider.name == "api-football":
            return self._get_live_matches_api_football(client)
        elif client.provider.name == "football-data":
            return self._get_live_matches_football_data(client)
        elif client.provider.name == "sports-db":
            return self._get_live_matches_sports_db(client)
    
    def _get_live_matches_api_football(self, client: APIClient) -> List[Dict[str, Any]]:
        """API Football implementation"""
        data = client.get("fixtures", params={"live": "all"})
        return self._normalize_matches(data.get("response", []), "api-football")
    
    def _get_live_matches_football_data(self, client: APIClient) -> List[Dict[str, Any]]:
        """Football Data implementation"""
        data = client.get("matches", params={"status": "LIVE"})
        return self._normalize_matches(data.get("matches", []), "football-data")
    
    def _get_live_matches_sports_db(self, client: APIClient) -> List[Dict[str, Any]]:
        """The Sports DB implementation"""
        # TheSportsDB doesn't have a direct live endpoint in free tier
        # Would need to check recent events
        logger.warning("TheSportsDB free tier has limited live match support")
        return []
    
    # ============= Matches by Date =============
    
    @with_fallback("api-football", "football-data", "sports-db")
    def get_matches_by_date(
        self, 
        match_date: date,
        league_id: Optional[int] = None,
        client: APIClient = None
    ) -> List[Dict[str, Any]]:
        """Get matches for a specific date"""
        if client.provider.name == "api-football":
            return self._get_matches_by_date_api_football(client, match_date, league_id)
        elif client.provider.name == "football-data":
            return self._get_matches_by_date_football_data(client, match_date)
        elif client.provider.name == "sports-db":
            return self._get_matches_by_date_sports_db(client, match_date)
    
    def _get_matches_by_date_api_football(
        self, 
        client: APIClient, 
        match_date: date,
        league_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """API Football implementation"""
        params = {"date": match_date.strftime("%Y-%m-%d")}
        if league_id:
            params["league"] = league_id
        
        data = client.get("fixtures", params=params)
        return self._normalize_matches(data.get("response", []), "api-football")
    
    def _get_matches_by_date_football_data(
        self, 
        client: APIClient, 
        match_date: date
    ) -> List[Dict[str, Any]]:
        """Football Data implementation"""
        params = {
            "dateFrom": match_date.strftime("%Y-%m-%d"),
            "dateTo": match_date.strftime("%Y-%m-%d")
        }
        data = client.get("matches", params=params)
        return self._normalize_matches(data.get("matches", []), "football-data")
    
    def _get_matches_by_date_sports_db(
        self, 
        client: APIClient, 
        match_date: date
    ) -> List[Dict[str, Any]]:
        """The Sports DB implementation"""
        date_str = match_date.strftime("%Y-%m-%d")
        data = client.get(f"eventsday.php", params={"d": date_str, "s": "Soccer"})
        return self._normalize_matches(data.get("events", []) or [], "sports-db")
    
    # ============= Leagues =============
    
    @with_fallback("api-football", "football-data", "sports-db")
    def get_leagues(self, country: Optional[str] = None, client: APIClient = None) -> List[Dict[str, Any]]:
        """Get available leagues"""
        if client.provider.name == "api-football":
            return self._get_leagues_api_football(client, country)
        elif client.provider.name == "football-data":
            return self._get_leagues_football_data(client)
        elif client.provider.name == "sports-db":
            return self._get_leagues_sports_db(client, country)
    
    def _get_leagues_api_football(self, client: APIClient, country: Optional[str]) -> List[Dict[str, Any]]:
        """API Football implementation"""
        params = {}
        if country:
            params["country"] = country
        
        data = client.get("leagues", params=params)
        return self._normalize_leagues(data.get("response", []), "api-football")
    
    def _get_leagues_football_data(self, client: APIClient) -> List[Dict[str, Any]]:
        """Football Data implementation"""
        data = client.get("competitions")
        return self._normalize_leagues(data.get("competitions", []), "football-data")
    
    def _get_leagues_sports_db(self, client: APIClient, country: Optional[str]) -> List[Dict[str, Any]]:
        """The Sports DB implementation"""
        data = client.get("all_leagues.php")
        leagues = data.get("leagues", []) or []
        
        if country:
            leagues = [l for l in leagues if l.get("strCountry", "").lower() == country.lower()]
        
        return self._normalize_leagues(leagues, "sports-db")
    
    # ============= Match Statistics =============
    
    @with_fallback("api-football", "football-data")
    def get_match_statistics(self, match_id: int, client: APIClient = None) -> Dict[str, Any]:
        """Get statistics for a specific match"""
        if client.provider.name == "api-football":
            return self._get_statistics_api_football(client, match_id)
        elif client.provider.name == "football-data":
            return self._get_statistics_football_data(client, match_id)
        
        return {}
    
    def _get_statistics_api_football(self, client: APIClient, match_id: int) -> Dict[str, Any]:
        """API Football implementation"""
        data = client.get("fixtures/statistics", params={"fixture": match_id})
        return data.get("response", {})
    
    def _get_statistics_football_data(self, client: APIClient, match_id: int) -> Dict[str, Any]:
        """Football Data implementation"""
        data = client.get(f"matches/{match_id}")
        return data
    
    # ============= Normalization Methods =============
    
    def _normalize_matches(self, matches: List[Dict], provider: str) -> List[Dict[str, Any]]:
        """Normalize match data from different providers to unified format"""
        normalized = []
        
        for match in matches:
            try:
                if provider == "api-football":
                    normalized.append({
                        "id": match["fixture"]["id"],
                        "date": match["fixture"]["date"],
                        "status": match["fixture"]["status"]["short"],
                        "minute": match["fixture"]["status"].get("elapsed"),
                        "league": {
                            "id": match["league"]["id"],
                            "name": match["league"]["name"],
                            "country": match["league"]["country"],
                            "logo": match["league"]["logo"]
                        },
                        "home_team": {
                            "id": match["teams"]["home"]["id"],
                            "name": match["teams"]["home"]["name"],
                            "logo": match["teams"]["home"]["logo"]
                        },
                        "away_team": {
                            "id": match["teams"]["away"]["id"],
                            "name": match["teams"]["away"]["name"],
                            "logo": match["teams"]["away"]["logo"]
                        },
                        "score": {
                            "home": match["goals"]["home"],
                            "away": match["goals"]["away"]
                        },
                        "provider": provider
                    })
                
                elif provider == "football-data":
                    normalized.append({
                        "id": match["id"],
                        "date": match["utcDate"],
                        "status": match["status"],
                        "minute": match.get("minute"),
                        "league": {
                            "id": match["competition"]["id"],
                            "name": match["competition"]["name"],
                            "country": match.get("area", {}).get("name", ""),
                            "logo": match["competition"].get("emblem")
                        },
                        "home_team": {
                            "id": match["homeTeam"]["id"],
                            "name": match["homeTeam"]["name"],
                            "logo": match["homeTeam"].get("crest")
                        },
                        "away_team": {
                            "id": match["awayTeam"]["id"],
                            "name": match["awayTeam"]["name"],
                            "logo": match["awayTeam"].get("crest")
                        },
                        "score": {
                            "home": match["score"]["fullTime"]["home"],
                            "away": match["score"]["fullTime"]["away"]
                        },
                        "provider": provider
                    })
                
                elif provider == "sports-db":
                    normalized.append({
                        "id": match["idEvent"],
                        "date": match.get("dateEvent"),
                        "status": match.get("strStatus", ""),
                        "minute": None,
                        "league": {
                            "id": match.get("idLeague"),
                            "name": match.get("strLeague", ""),
                            "country": match.get("strCountry", ""),
                            "logo": match.get("strLeagueBadge")
                        },
                        "home_team": {
                            "id": match.get("idHomeTeam"),
                            "name": match.get("strHomeTeam", ""),
                            "logo": match.get("strHomeTeamBadge")
                        },
                        "away_team": {
                            "id": match.get("idAwayTeam"),
                            "name": match.get("strAwayTeam", ""),
                            "logo": match.get("strAwayTeamBadge")
                        },
                        "score": {
                            "home": int(match.get("intHomeScore", 0) or 0),
                            "away": int(match.get("intAwayScore", 0) or 0)
                        },
                        "provider": provider
                    })
            
            except (KeyError, TypeError) as e:
                logger.error(f"Error normalizing match from {provider}: {e}")
                continue
        
        return normalized
    
    def _normalize_leagues(self, leagues: List[Dict], provider: str) -> List[Dict[str, Any]]:
        """Normalize league data from different providers"""
        normalized = []
        
        for league in leagues:
            try:
                if provider == "api-football":
                    normalized.append({
                        "id": league["league"]["id"],
                        "name": league["league"]["name"],
                        "country": league["country"]["name"],
                        "logo": league["league"]["logo"],
                        "type": league["league"]["type"],
                        "provider": provider
                    })
                
                elif provider == "football-data":
                    normalized.append({
                        "id": league["id"],
                        "name": league["name"],
                        "country": league.get("area", {}).get("name", ""),
                        "logo": league.get("emblem"),
                        "type": league.get("type", ""),
                        "provider": provider
                    })
                
                elif provider == "sports-db":
                    normalized.append({
                        "id": league["idLeague"],
                        "name": league["strLeague"],
                        "country": league.get("strCountry", ""),
                        "logo": league.get("strBadge"),
                        "type": league.get("strSport", ""),
                        "provider": provider
                    })
            
            except (KeyError, TypeError) as e:
                logger.error(f"Error normalizing league from {provider}: {e}")
                continue
        
        return normalized
