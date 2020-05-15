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
      
GIT

      git clone https://github.com/gkunst85/Reactivities.git