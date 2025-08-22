using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BuggyDonationService.Services;
using BuggyDonationService.Models;

namespace BuggyDonationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonationController : ControllerBase
    {
        private readonly DonationService _donationService;
        private readonly ExternalDataService _externalService;

        // inject services instead of constructing directly (enables testing and configuration)
        public DonationController(DonationService donationService, ExternalDataService externalService)
        {
            _donationService = donationService;
            _externalService = externalService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateDonation([FromBody] CreateDonationRequest request)
        {
            var result = await _donationService.ProcessDonationAsync(request.DonorName, request.Amount);
            return Ok(new { success = true, message = result });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDonationStats()
        {
            // await async call for async methods, avoid sync-over-async deadlocks
            var externalData = await _externalService.GetMarketData();
            var stats = await _donationService.GetStatsAsync();

            return Ok(new {
                stats = stats,
                marketInfo = externalData
            });
        }

        [HttpGet("{donorName}/history")]
        public async Task<IActionResult> GetDonorHistory(string donorName)
        {
            var history = await _donationService.GetDonorHistoryAsync(donorName);
            return Ok(history);
        }
    }
}