const { Pool } = require("pg");

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylist(owner) {
        const query = {
            text: `SELECT playlist.id, playlist.name, users.username FROM playlist
            LEFT JOIN collaborations ON playlist.id = collaborations.playlist_id  
            LEFT JOIN users ON playlist.owner  = users.id
           
            WHERE playlist.owner = $1 OR collaborations.user_id = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = PlaylistsService;
