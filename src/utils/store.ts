import { throttle } from '@/utils/throttle';
export default class Store {
	@throttle(2000)
	static log(log: string) {
		console.log(log);
	}
}
