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

        const playlist = await this._pool.query(query);

        const playlistId = playlist.rows[0].id;
        const playlists = playlist.rows[0];
        const songs = await this.getSongsPlaylist(playlistId);
        playlists.songs = songs;
        console.log(playlists);
        return playlist.rows[0];
    }

    async getSongsPlaylist(playlistId) {
        const query = {
            text: `select songsplaylist.id, songs.title, songs.performer from songsplaylist
                    left join songs on songs.id = songsplaylist.song_id
                    where songsplaylist.playlist_id = $1`,
            values: [playlistId],

        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            console.log("playlist tidak ditemukan");
        }

        return result.rows.map((songs) => ({
            id: songs.id,
            title: songs.title,
            performer: songs.performer,
        }));
    }
}

module.exports = PlaylistsService;
