import { ROOM_PHASE, USER_ROLE } from '@constant';
import { InmemoryRoom, User } from '@types';

export interface RoomRepository {
	/**
	 * uuid를 key로 repository에 유저의 socket id를 저장할 객체를 생성하고
	 * uuid를 key로 방을 식별할 수 있는 객체에 room의 상태를 LOBBY로 저장하는 메서드입니다.
	 * @param uuid room을 식별할 수 있는 고유한 key
	 */
	createRoom({ roomUUID, room }: { roomUUID: string; room: InmemoryRoom }): InmemoryRoom;

	deleteRoom(roomUUID: string): void;

	/**
	 * uuid로 방 정보를 가져옵니다.
	 * @param roomUUID
	 * @Return InmemoryRoom
	 */
	getRoom(roomUUID: string): InmemoryRoom;

	/**
	 * room uuid기반으로 해당 방에 존재하는 user 배열을 반환합니다.
	 * @param roomUUID
	 * @returns User[]
	 */
	getUsersInRoom(roomUUID: string): User[];

	/**
	 * room uuid 기반으로 해당 방에 user를 저장합니다.
	 * @param roomUUID
	 * @param user User
	 */
	saveUserInRoom({
		clientId,
		roomUUID,
		user,
	}: {
		clientId: string;
		roomUUID: string;
		user: User;
	}): void;

	/**
	 * client socket id로 mapping된 user 객체를 반환합니다.
	 * @param clientId
	 * @returns User
	 */
	getUserByClientId(clientId: string): User;

	getClientIdByUser(uuid: string): string;

	/**
	 * roomUUID를 기반으로 해당 방에 있는 user를 제거합니다.
	 * @param clientId socket id
	 * @param user User
	 */
	removeUserInRoom({ roomUUID, user }: { roomUUID: string; user: User }): void;

	/**
	 * 방의 현재 phase를 반환합니다.
	 * @param roomUUID
	 * @returns ROOM_PHASE
	 */
	getRoomPhase(roomUUID: string): ROOM_PHASE;

	/**
	 * 해당 room uuid의 room의 interview phase를 update 합니다.
	 * @param roomUUID
	 * @param phase
	 */
	updateRoomPhase({ roomUUID, phase }: { roomUUID: string; phase: ROOM_PHASE }): void;

	updateUserInfo({ uuid, updateUser }: { uuid: string; updateUser: Partial<User> });
}
