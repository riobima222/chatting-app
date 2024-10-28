export const sortUsersByLastChat = (users: any[]): any[] => {
  return [...users].sort((a, b) => {
    const timeA = a.lastChat?.seconds || 0;
    const timeB = b.lastChat?.seconds || 0;
    return timeB - timeA;
  });
};
