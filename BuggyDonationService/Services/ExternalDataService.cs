using System.Net.Http;
using System.Threading.Tasks;

namespace BuggyDonationService.Services
{
    public class ExternalDataService
    {
        private readonly HttpClient _httpClient;

        // yped HttpClient provided by DI to avoid socket exhaustion
        public ExternalDataService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> GetMarketData()
        {
            var response = await _httpClient.GetStringAsync("https://api.marketdata.org/charity-insights");
            return response;
        }

        public async Task<string> GetDonationTrends()
        {
            return await _httpClient.GetStringAsync("https://api.givingtrends.org/monthly-report");
        }
    }
}