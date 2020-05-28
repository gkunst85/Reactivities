using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
      public class Details
      {
            public class Query : IRequest<Profile>
            {
                  public string UserName { get; set; }
            }

            public class Handler : IRequestHandler<Query, Profile>
            {
                  private readonly DataContext _context;

                  public Handler(DataContext context)
                  {
                        _context = context;
                  }

                  public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
                  {
                        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);
                        if (user == null)
                              throw new RestException(HttpStatusCode.NotFound, new { Profile = "Could not find username" });

                        return new Profile
                        {
                              UserName = user.UserName,
                              DisplayName = user.DisplayName,
                              MainImage = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                              Photos = user.Photos,
                              Bio = user.Bio
                        };
                  }
            }
      }
}