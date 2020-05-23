using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.Users
{
      public class CurrentUser
      {

            public class Query : IRequest<User> { }

            public class Handler : IRequestHandler<Query, User>
            {
                  private readonly UserManager<AppUser> _userManager;
                  private readonly IUserAccessor _userAccessor;
                  private readonly IJwtGenerator _jwtGenerator;

                  public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
                  {
                        _jwtGenerator = jwtGenerator;
                        _userAccessor = userAccessor;
                        _userManager = userManager;
                  }

                  public async Task<User> Handle(Query query, CancellationToken cancellationToken)
                  {
                        var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());
                        if (user == null)
                              throw new RestException(HttpStatusCode.Unauthorized);

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