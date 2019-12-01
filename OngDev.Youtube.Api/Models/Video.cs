namespace OngDev.Youtube.Api.Models
{
  public class Video
  {
    public string Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string ThumbnailUrl { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int DislikeCount { get; set; }
    public int ShareCount { get; set; }
    public string VideoUrl { get; set; }
  }
}