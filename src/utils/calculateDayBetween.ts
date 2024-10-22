export function calculateTimeDifference(dateString: string): string {
  
  // Mengubah string tanggal menjadi objek Date
  const inputDate = new Date(dateString);

  // Memeriksa apakah tanggal yang diberikan valid
  if (isNaN(inputDate.getTime())) {
    throw new Error("Tanggal tidak valid");
  }

  // Mendapatkan tanggal saat ini
  const currentDate = new Date();

  // Menghitung selisih dalam milidetik
  const timeDifference = currentDate.getTime() - inputDate.getTime();

  // Menghitung selisih dalam detik
  const secondsDifference = Math.floor(timeDifference / 1000);

  // Menghitung hari, jam, menit, dan detik
  const days = Math.floor(secondsDifference / (3600 * 24));
  const hours = Math.floor((secondsDifference % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsDifference % 3600) / 60);

  // Menyusun hasil
  if (days > 0) {
    return `${days} hari yang lalu`;
  } else if (hours > 0) {
    return `${hours} jam yang lalu`;
  } else if (minutes > 0) {
    return `${minutes} menit yang lalu`;
  } else {
    return "Baru saja";
  }
}