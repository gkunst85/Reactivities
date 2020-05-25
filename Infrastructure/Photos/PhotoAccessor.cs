using System;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
      public class PhotoAccessor : IPhotoAccessor
      {
            private readonly Cloudinary _cloudinary;

            // IOptions<CloudinarySettings> allows to gain access inside our user-secrets cloudinary section
            // Cloudinary:CloudName & Cloudinary:ApiKey & Cloudinary:ApiSecret 
            public PhotoAccessor(IOptions<CloudinarySettings> config)
            {
                  // Initalize cloudinary account object 
                  var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);

                  _cloudinary = new Cloudinary(account);
            }

            public PhotoUploadResult AddPhoto(IFormFile file)
            {
                  var uploadResult = new ImageUploadResult();

                  if (file.Length > 0)
                  {
                        using (var stream = file.OpenReadStream())
                        {
                              var uploadParams = new ImageUploadParams
                              {
                                    File = new FileDescription(file.FileName, stream)
                              };

                              uploadResult = _cloudinary.Upload(uploadParams);
                        };
                  }

                  if (uploadResult.Error != null)
                        throw new Exception(uploadResult.Error.Message);

                  return new PhotoUploadResult
                  {
                        PublicId = uploadResult.PublicId,
                        Url = uploadResult.SecureUri.AbsoluteUri
                  };
            }

            public string DeletePhoto(string publicId)
            {
                  throw new System.NotImplementedException();
            }
      }
}