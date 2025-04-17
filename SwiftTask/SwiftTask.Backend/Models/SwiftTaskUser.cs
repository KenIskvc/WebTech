using Microsoft.AspNetCore.Identity;

namespace SwiftTask.Backend.Models
{
    public class SwiftTaskUser : IdentityUser
    {
        public virtual ICollection<Topic> Topics { get; set; } = new List<Topic>();
    }
}
