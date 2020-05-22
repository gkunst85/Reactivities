Project Stracture
===========================

API - Presentation Layer
APPLICATION -
DOMAIN -
PERSISTENCE


Data Access Layer
Business Logic Layer

Project Building Steps
===========================

1. Building skeleton api
2. Building skeleton client
3. Adding CORS support
4. Building CRUD operations on API
5. Building CRUD operations on client
6. Updating the data localy on app state
7. Connecting axios to the client
8. Adding mobX and creating stores
9. Creating Routing with React Router
10. Error handling using middlewares (Server & Client) and validation

Commands
===========================

CMD 

      mkdir [folderName]

NPM

      npx create-react-app client-app --use-npm --typescript
      npm i (install)
      npm start

.NET CLI

      // Gives a list of all of the different project types & templates
      dotnet new -h 

      // Creates a sloution with the name of the folder
      dotnet new sln

      // Creates a class library
      dotnet new classlib -n [name]

      // Creates a webapi project
      dotnet new webapi -n [name]

      // Adds project to sloution
      dotnet sln add [projectName/folder]

      // Adds reference from one project to another 
      dotnet add reference ../[ProjectFolder]/

Migrations:
      
      dotnet tool install --global dotnet-ef --version 3.0.0

      dotnet ef migrations add "[migrationName]" -p [projectName] -s [startup projectName]
      dotnet ef migrations add "SeedValues" -p Persistence/ -s API/

      dotnet ef database drop -p [projectName] -s [startup projectName]
      
GIT

      git clone https://github.com/gkunst85/Reactivities.git

Patterns
===========================
1. USED -> CQRS & Mediator Pattern
2. ALTERNATIVE -> Repository Pattern