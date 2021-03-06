using System.Text;
using System.Threading.Tasks;
using API.Middlewares;
using API.SignalR;
using Application.Activities;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseLazyLoadingProxies();
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });

            // Need specifying of 1 class that is using the handler
            services.AddMediatR(typeof(List.Handler).Assembly);

            services.AddAutoMapper(typeof(List.Handler).Assembly);

            // Enable CORS
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                      {
                      policy.AllowAnyHeader()
                                  .AllowAnyMethod()
                                  .AllowCredentials()
                                  .WithOrigins("http://localhost:3000");
                  });
            });

            // Add autorize filter policy to all the controllers & Add fluent validation
            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();

                opt.Filters.Add(new AuthorizeFilter(policy));
            })
                    .AddFluentValidation(cfg =>
            {
                      // Need specifying of 1 class that is using the fluent validations
                      cfg.RegisterValidatorsFromAssemblyContaining<Create>();
            });

            // Add Identity
            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                policy.Requirements.Add(new IsHostRequirement());
            });
            });

            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            // In dev enviorment - get the key from user-secrets
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                  .AddJwtBearer(opt =>
                  {
                      opt.TokenValidationParameters = new TokenValidationParameters
                      {
                          ValidateIssuerSigningKey = true,
                          IssuerSigningKey = key,
                          ValidateAudience = false,
                          ValidateIssuer = false
                      };

                            // For signalR token support
                            opt.Events = new JwtBearerEvents
                      {
                          OnMessageReceived = context =>
                                {
                                  var accessToken = context.Request.Query["access_token"];
                                  var path = context.HttpContext.Request.Path;

                                  if (!string.IsNullOrWhiteSpace(accessToken) && path.StartsWithSegments("/chat"))
                                  {
                                      context.Token = accessToken;
                                  }

                                  return Task.CompletedTask;
                              }
                      };
                  });

            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();

            // Using CloudinaryDotNet nuget
            // Get configuration section from dotnet user-secrets (or any other configuration) 
            // and apply on CloudinarySettings class
            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));

            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();

            // if (env.IsDevelopment())
            // {
            //       app.UseDeveloperExceptionPage();
            // }

            // Redirect http to https
            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
    }
}
