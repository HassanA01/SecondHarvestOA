using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using BuggyDonationService.Models;

namespace BuggyDonationService.Repositories
{
    public class DonationRepository
    {
        private readonly string _connectionString;

        // inject connection string instead of hardcoding secrets
        public DonationRepository(string connectionString)
        {
            _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        }

        public string SaveDonation(Donation donation)
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();

            // using parameterized sql to prevent sql injection and handle escaping
            var query = "INSERT INTO Donations (DonorName, Amount, CreatedDate) VALUES (@DonorName, @Amount, @CreatedDate)";
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@DonorName", donation.DonorName);
            command.Parameters.AddWithValue("@Amount", donation.Amount);
            command.Parameters.AddWithValue("@CreatedDate", donation.CreatedDate);
            command.ExecuteNonQuery();

            return "Donation processed successfully";
        }

        public int GetDonationCount()
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();
            
            var command = new SqlCommand("SELECT COUNT(*) FROM Donations", connection);
            return (int)command.ExecuteScalar();
        }

        public decimal GetTotalAmount()
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();
            
            var command = new SqlCommand("SELECT ISNULL(SUM(Amount), 0) FROM Donations", connection);
            return (decimal)command.ExecuteScalar();
        }

        public List<Donation> GetDonationsByDonor(string donorName)
        {
            var donations = new List<Donation>();
            using var connection = new SqlConnection(_connectionString);
            connection.Open();

            // parameterized read query instead of string interpolation
            var query = "SELECT Id, DonorName, Amount, CreatedDate FROM Donations WHERE DonorName = @DonorName";
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@DonorName", donorName);
            using var reader = command.ExecuteReader();

            // read via ordinals for safety
            var idOrdinal = reader.GetOrdinal("Id");
            var nameOrdinal = reader.GetOrdinal("DonorName");
            var amountOrdinal = reader.GetOrdinal("Amount");
            var createdOrdinal = reader.GetOrdinal("CreatedDate");

            while (reader.Read())
            {
                donations.Add(new Donation
                {
                    Id = reader.GetInt32(idOrdinal),
                    DonorName = reader.GetString(nameOrdinal),
                    Amount = reader.GetDecimal(amountOrdinal),
                    CreatedDate = reader.GetDateTime(createdOrdinal)
                });
            }

            return donations;
        }
    }
}