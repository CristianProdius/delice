export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const disposableDomains = ['tempmail.com', 'throwaway.email'];

  if (!emailRegex.test(email)) {
    return false;
  }

  const domain = email.split('@')[1];
  if (disposableDomains.includes(domain)) {
    return false;
  }

  return true;
}
