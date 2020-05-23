using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.Users
{
      public class Login
      {
            public class Query : IRequest<User>
            {
                  public string Email { get; set; }
                  public string Password { get; set; }
            }

            public class QueryValidator : AbstractValidator<Query>
            {
                  public QueryValidator()
                  {
                        RuleFor(x => x.Email).NotEmpty();
                        RuleFor(x => x.Password).NotEmpty();
                  }
            }

            public class Handler : IRequestHandler<Query, User>
            {
                  private readonly UserManager<AppUser> _userManager;
                  private readonly SignInManager<AppUser> _signInManager;
                  private readonly IJwtGenerator _jwtGenerator;

                  public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
                  {
                        _jwtGenerator = jwtGenerator;
                        _userManager = userManager;
                        _signInManager = signInManager;
                  }

                  public async Task<User> Handle(Query query, CancellationToken cancellationToken)
                  {
                        var user = await _userManager.FindByEmailAsync(query.Email);
                        if (user == null)
                              throw new RestException(HttpStatusCode.Unauthorized);

                        var lockoutOnFailure = false;
                        var result = await _signInManager.CheckPasswordSignInAsync(user, query.Password, lockoutOnFailure);

                        if (!result.Succeeded)
                              throw new RestException(HttpStatusCode.Unauthorized);

                        // TODO: generate token

                        return new User
                        {
                              DisplayName = user.DisplayName,
                              Username = user.UserName,
                              Token = _jwtGenerator.CreateToken(user),
                              Image = null
                        };
                  }
            }
      }
}