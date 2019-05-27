import { debounce } from '@/utils/debounce';
export default class Store {
	@debounce(2000)
	static log() {
		console.log('打日志');
	}
}
