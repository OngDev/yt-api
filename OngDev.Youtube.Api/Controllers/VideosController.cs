using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OngDev.Youtube.Api.Models;

namespace OngDev.Youtube.Api.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class VideosController : ControllerBase
  {
    private readonly ILogger<VideosController> _logger;
    public VideosController(ILogger<VideosController> logger)
    {
      _logger = logger;
    }

    [HttpGet]
    public IEnumerable<Video> Get()
    {
      return null;
    }
  }
}