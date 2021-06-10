using System;
using System.Threading.Tasks;
using API.Extentions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalIR
{
    public class PresenceHub: Hub
    {
        [Authorize]
        public override async Task OnConnectedAsync(){
            await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());
        }

        public override async Task OnDisconnectedAsync(Exception exception){
            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());

            await base.OnDisconnectedAsync(exception);
        }

    }
}