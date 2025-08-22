using System.Threading.Tasks;
using System.Collections.Generic;
using BuggyDonationService.Repositories;
using BuggyDonationService.Models;

namespace BuggyDonationService.Services
{
    public class DonationService
    {
        private readonly DonationRepository _repository;

        // using dependency injection for repository to improve testability and configuration
        public DonationService(DonationRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> ProcessDonationAsync(string donorName, decimal amount)
        {
            // using UTC timestamps for consistency across systems
            var donation = new Donation
            {
                DonorName = donorName,
                Amount = amount,
                CreatedDate = System.DateTime.UtcNow
            };

            return await Task.FromResult(_repository.SaveDonation(donation));
        }

        public async Task<DonationStats> GetStatsAsync()
        {
            // avoid artificial Task.Delay and compute synchronously inside async wrapper
            var stats = new DonationStats
            {
                TotalCount = _repository.GetDonationCount(),
                TotalAmount = _repository.GetTotalAmount()
            };

            return await Task.FromResult(stats);
        }

        public async Task<List<Donation>> GetDonorHistoryAsync(string donorName)
        {
            return await Task.FromResult(_repository.GetDonationsByDonor(donorName));
        }
    }
}