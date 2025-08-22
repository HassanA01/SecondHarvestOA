# BuggyDonationService - Code Review and Fixes

## Overview

This review identifies and fixes three high-impact bugs/code smells in the ASP.NET Core donation service, and documents three additional issues to address next. All changes are annotated inline in the code with brief comments for quick discovery.

## Fixed Issues (3)

1. SQL Injection and Hardcoded Secrets in `DonationRepository`

   - Problem:
     - Connection string with credentials was hardcoded in the repository constructor.
     - SQL statements were built with string interpolation for both INSERT and SELECT, enabling SQL injection and breaking for special characters.
   - Fix:
     - Injected the connection string via DI (configured in `Startup.cs`), removing secrets from code.
     - Switched to parameterized queries using `SqlCommand.Parameters` and used ordinals for safe, efficient reads.
   - Files/edits:
     - `Repositories/DonationRepository.cs`: injected connection string; parameterized INSERT/SELECT; used ordinals.
     - `Startup.cs`: registered `DonationRepository` with a connection string from `appsettings.json` or `DONATION_DB` env var.

2. Improper Service Construction and Sync-over-Async in `DonationController`

   - Problem:
     - Controller instantiated services directly (`new DonationService`, `new ExternalDataService`), blocking DI/testing.
     - Used `.Result` on an async call, which risks deadlocks and thread starvation.
   - Fix:
     - Applied constructor injection for `DonationService` and `ExternalDataService`.
     - Awaited asynchronous calls end-to-end.
   - Files/edits:
     - `Controllers/DonationController.cs`: DI-based constructor; awaited `GetMarketData()`; added rationale comments.
     - `Startup.cs`: registered `DonationService`.

3. `HttpClient` Misuse and Fake Async Work in Services
   - Problem:
     - `ExternalDataService` created a new `HttpClient` per call → socket exhaustion risk.
     - `DonationService` used arbitrary `Task.Delay` calls and local time.
   - Fix:
     - Registered a typed `HttpClient<ExternalDataService>` and injected it.
     - Removed fake delays, used `Task.FromResult` to keep async signatures without blocking; switched to UTC timestamps for consistency.
   - Files/edits:
     - `Services/ExternalDataService.cs`: constructor now accepts `HttpClient` via DI.
     - `Services/DonationService.cs`: DI constructor; removed delays; used `DateTime.UtcNow`.

## Additional Issues (identified, not fixed)

1. Missing Request Validation and Error Handling

   - `CreateDonation` does not check `ModelState` or handle repository exceptions. Add model validation, return 400 for invalid input, and wrap repository calls with try/catch to return appropriate status codes (e.g., 500 with problem details).

2. Lack of Auth, CORS, and Rate Limiting

   - The API is unauthenticated and open. Add JWT bearer authentication, configure CORS for allowed origins, and consider minimal rate limiting to protect endpoints.

3. ADO.NET Hand-Rolled Data Access
   - Consider migrating to EF Core with a `DbContext` and migrations for maintainability, schema evolution, and testability. This would also enable better validation and transactional support.

## How to Configure

- Provide `DonationDb` connection string via `appsettings.json` or set `DONATION_DB` env var. Example:

```json
{
  "ConnectionStrings": {
    "DonationDb": "Server=localhost;Database=CharityDonations;Trusted_Connection=True;"
  }
}
```

## Testing the Changes

- Build and run the API. Exercise endpoints:
  - POST `api/donation/create` with `{ "donorName": "Alice", "amount": 25.00 }`.
  - GET `api/donation/stats`.
  - GET `api/donation/{donorName}/history`.

All database interactions now use parameterized queries and the service/controller are wired through DI.
