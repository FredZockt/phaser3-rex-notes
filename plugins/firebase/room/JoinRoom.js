import { GetRoomType } from "./RoomFilterMethods.js";
import GetValue from '../../utils/object/GetValue.js';
import OnJoinRoom from './OnJoinRoom.js';

var TryJoinRoom = function (config) {
    var leftThenJoin = GetValue(config, 'leftThenJoin', true);

    var self = this;
    if (leftThenJoin) {
        return this.leaveRoom()
            .then(function () {
                return JoinRoom.call(self, config);
            })
    } else {
        return JoinRoom.call(self, config);
    }
}

var JoinRoom = function (config) {
    var roomID = GetValue(config, 'roomID', undefined);
    if (roomID === undefined) {
        return Promise.reject();
    }

    this.isRemoveRoomWhenLeft = false;
    var self = this;
    return IsRoomOpened.call(self, config)
        .then(function (metadata) {
            return self.userList
                .setRootPath(self.getUserListPath(config.roomID))
                .setMaxUsers(metadata.maxUsers)
                .join();
        })
        .then(function () {
            OnJoinRoom.call(self, config);
            return Promise.resolve(config);
        })
}

var IsRoomOpened = function (config) {
    var self = this;
    return this.getRoomMetadataRef(config.roomID).once('value')
        .then(function (snapshot) {
            var metadata = snapshot.val();
            config.roomName = metadata.name;
            config.roomType = GetRoomType(metadata.filter);

            if (!self.isRoomOpened(metadata)) {
                return Promise.reject();
            } else {
                return Promise.resolve(metadata);
            }
        });
}

export default TryJoinRoom;
