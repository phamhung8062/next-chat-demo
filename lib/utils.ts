import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getFromAndTo(page: number, itemPerPage: number) {
	let from = page * itemPerPage;
	let to = from + itemPerPage;

	if (page > 0) {
		from += 1;
	}
	return { from, to };
}


export function generateAndStoreCode(key: string, length: number): string {
  const code = crypto.randomBytes(length)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, length);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, code); // Lưu mã vào localStorage với key được cung cấp
  }

  return code;
}
