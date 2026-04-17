import useSocketEvent from "@/shared/hooks/useSocketEvent";
import { Message } from "../message.types";
import { useQueryClient } from "@tanstack/react-query";
import { usePersonalInfo } from "@/modules/user/user.query";

export default function useMessageSocket(roomId: string | null) {
  const queryClient = useQueryClient();
  const { data: personalInfo } = usePersonalInfo();

  const handleNewMessage = (message: Message) => {
    console.log("new message received: ", message);
    const formattedMsg: Message = {
      ...message,
      isOwn: message.sender.id === personalInfo?.id,
    };
    queryClient.setQueryData(["messages", roomId], (oldData: any) => {
      if (!oldData) {
        return {
          pages: [
            {
              data: [formattedMsg],
              nextCursor: null,
            },
          ],
          pageParams: [null],
        };
      }

      console.log("oldData: ", oldData);

      const pages = [...oldData.pages];

      // append message to FIRST page (latest messages)
      pages[0] = {
        ...pages[0],
        data: [formattedMsg, ...pages[0].data],
      };

      return {
        ...oldData,
        pages,
      };
    });
  };

  // events
  useSocketEvent("message:new", handleNewMessage);
}


// const handleNewMessage = (message: Message & { tempId?: string }) => {
//   const formattedMsg: Message = {
//     ...message,
//     isOwn: message.sender.id === personalInfo?.id,
//   };

//   queryClient.setQueryData<MessagesData>(["messages", roomId], (oldData) => {
//     if (!oldData) {
//       return {
//         pages: [{ data: [formattedMsg], nextCursor: null }],
//         pageParams: [null],
//       };
//     }

//     // If this message has a tempId, try to replace the optimistic one
//     if (message.tempId) {
//       const pages = oldData.pages.map((page) => ({
//         ...page,
//         data: page.data.map((m) =>
//           m.id === message.tempId ? formattedMsg : m
//         ),
//       }));

//       // Check if replacement happened
//       const replaced = pages.some((p, i) =>
//         p.data.some((m, j) => m.id !== oldData.pages[i].data[j].id)
//       );

//       if (replaced) return { ...oldData, pages };
//     }

//     // Otherwise prepend as a new message
//     const pages = [...oldData.pages];
//     pages[0] = { ...pages[0], data: [formattedMsg, ...pages[0].data] };
//     return { ...oldData, pages };
//   });
// };