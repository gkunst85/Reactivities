using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{

    // Inherit from AspNetCore.Identity and extend it
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }

        // Defines the relationship between our AppUser class and the UserActivities class
        public virtual ICollection<UserActivity> UserActivities { get; set; }
    }
}