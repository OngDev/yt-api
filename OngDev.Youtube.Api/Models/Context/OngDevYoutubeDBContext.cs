using Microsoft.EntityFrameworkCore;
using OngDev.Youtube.Api.Models;

namespace OngDev.Youtube.Api.Models.Context
{
  public class OngDevYoutubeDBContext : DbContext
  {
    public OngDevYoutubeDBContext(DbContextOptions<OngDevYoutubeDBContext> options) : base(options)
    {

    }
    public DbSet<Video> Videos { get; set; }
  }
}