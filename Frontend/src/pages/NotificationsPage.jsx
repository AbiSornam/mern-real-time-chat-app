import React from 'react'
import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';  
import { acceptFriendRequest, getFriendRequests } from '../lib/api';
import { UserCheckIcon, MapPinIcon, ClockIcon, MessageSquare, BellIcon } from 'lucide-react';
import { getLanguageFlag } from '../components/FriendCard';
const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isLoading: isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const incomingRequests = friendRequests?.friendRequests || [];
  const acceptedRequests = friendRequests?.AcceptFriendRequest || [];
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center gap-4">
                          <div className="avatar w-14 h-14 rounded-full overflow-hidden">
                            <img
                              src={request.sender.profilePic || '/vite.svg'}
                              alt={request.sender.fullName}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/vite.svg';
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{request.sender.fullName}</h3>
                                {request.sender.location && (
                                  <div className="flex items-center text-xs opacity-70 mt-1">
                                    <MapPinIcon className="w-3 h-3 mr-1" />
                                    {request.sender.location}
                                  </div>
                                )}
                              </div>

                              <div className="text-right">
                                <div className="flex flex-col items-end">
                                  <div className="text-sm opacity-70">{new Date(request.createdAt).toLocaleString()}</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="badge badge-secondary text-xs">
                                {getLanguageFlag(request.sender.nativeLanguage)} Native: {request.sender.nativeLanguage}
                              </span>
                              <span className="badge badge-outline text-xs">
                                {getLanguageFlag(request.sender.learningLanguage)} Learning: {request.sender.learningLanguage}
                              </span>
                            </div>

                            {request.sender.bio && <p className="text-sm opacity-70 mt-3">{request.sender.bio}</p>}

                            <div className="mt-3 flex gap-2">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => acceptRequestMutation(request._id)}
                                disabled={isPending}
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-primary" />
                  New Connections
                </h2>
                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full overflow-hidden">
                            <img
                              src={notification.recipient?.profilePic || '/vite.svg'}
                              alt={notification.recipient?.fullName}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/vite.svg';
                              }}
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold">{notification.recipient?.fullName}</h3>
                            <p className="text-sm my-1">{notification.recipient?.fullName} accepted your friend request</p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {notification.updatedAt ? new Date(notification.updatedAt).toLocaleString() : 'Recently'}
                            </p>
                          </div>

                          <div className="badge badge-success">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="card bg-base-200 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">No notifications</h3>
                <p className="text-base-content opacity-70">You're all caught up!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
