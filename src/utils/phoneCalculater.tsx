export const phoneCalculate = (phone: string) => {
  // all checks are for israeli numbers
  if (
    (phone.length === 10 && phone[1] === "5") ||
    (phone.length === 9 && phone[0] === "5")
  ) {
    if (phone.length === 9) {
      phone = "0".concat(phone);
    }
    return `${phone[0]}${phone[1]}${phone[2]}-${phone[3]}${phone[4]}${phone[5]}-${phone[6]}${phone[7]}${phone[8]}${phone[9]}`;
  }

  if ((phone.length === 9 && phone[0] === "0") || phone.length === 8) {
    if (phone.length === 8) {
      phone = "0".concat(phone);
    }
    return `${phone[0]}${phone[1]}-${phone[2]}${phone[3]}${phone[4]}-${phone[5]}${phone[6]}${phone[7]}${phone[8]}`;
  }

  return phone;
};
