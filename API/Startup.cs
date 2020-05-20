using Application.Activities;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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
                        opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
                  });

                  // Need specifying of 1 class that is using the handler
                  services.AddMediatR(typeof(List.Handler).Assembly);
                  services.AddCors(opt =>
                  {
                        opt.AddPolicy("CorsPolicy", policy =>
                        {
                              policy.AllowAnyHeader()
                                    .AllowAnyMethod()
                                    .WithOrigins("http://localhost:3000");
                        });
                  });
                  services.AddControllers()
                          .AddFluentValidation(cfg =>
                          {
                                // Need specifying of 1 class that is using the fluent validations
                                cfg.RegisterValidatorsFromAssemblyContaining<Create>();
                          });
            }

            // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
            public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
            {
                  if (env.IsDevelopment())
                  {
                        app.UseDeveloperExceptionPage();
                  }

                  // Redirect http to https
                  // app.UseHttpsRedirection();

                  app.UseRouting();

                  app.UseAuthorization();

                  app.UseCors("CorsPolicy");

                  app.UseEndpoints(endpoints =>
                  {
                        endpoints.MapControllers();
                  });
            }
      }
}
