This is solution modern frame for development website uses last version Angular and Web API Core 2.0 service.

<a href="http://owners2.azurewebsites.net">http://owners2.azurewebsites.net</a>

For authentication uses OAuth Bearer Token and implements Refresh Tokens. 
The backend API is built using ASP.NET Web API Core 2.0, JSON Web Tokens, ASP.NET Identity and Entity Framework.

Solution devided on 4 projects:

- Ordes - main project, uses Angular with WebPack and ASP.Net Core 2.0
- API - REST Service, uses ASP.NET Web API Core 2.0
- DAL - Data Access Layer, uses Entity Framework Core.
- BLL - Business Logic Layer

After download and open need refresh node modules in project Orders. For easy uses WebPack install <a href="https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebPackTaskRunner">Web Pack Task Runner</a>. 

For run front-end unit-tests uses Karma, Jasmine and Gulp.

For Database point you connection string in project API in file appsettings.json. After first run application, database will be create in memory automaticaly for testing service.

For authorizarion via social networks need point your tokens for google and facebook in project Api, but you can use mine, if its still will be work.
