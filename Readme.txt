Project Stracture
===========================

API - Presentation Layer
APPLICATION -
DOMAIN -
PERSISTENCE


Data Access Layer
Business Logic Layer

Commands
===========================

migrations:
dotnet ef migrations add [migrationName] -p [projectName] -s [startup projectName]
dotnet ef migrations add SeedValues -p Persistence/ -s API/