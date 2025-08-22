using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using BuggyDonationService.Middleware;
using BuggyDonationService.Repositories;
using BuggyDonationService.Services;
using System;

namespace BuggyDonationService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // register typed HttpClient for ExternalDataService
            services.AddHttpClient<ExternalDataService>();

            // inject connection string from config/env; avoid hardcoded secrets
            services.AddScoped<DonationRepository>(sp =>
                new DonationRepository(
                    Configuration.GetConnectionString("DonationDb")
                    ?? Environment.GetEnvironmentVariable("DONATION_DB")
                    ?? "Server=localhost;Database=CharityDonations;Trusted_Connection=True;"));

            // register domain service
            services.AddScoped<DonationService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMiddleware<RequestLoggingMiddleware>();
            
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}