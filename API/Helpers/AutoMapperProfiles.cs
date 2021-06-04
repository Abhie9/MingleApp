using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extentions;
using AutoMapper;

namespace API.Interfaces
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>().ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src 
            => src.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(des => des.SenderPhotoUrl, opt => opt.MapFrom(src=> 
                src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(des => des.RecipientPhotoUrl, opt => opt.MapFrom(src=> 
                src.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}