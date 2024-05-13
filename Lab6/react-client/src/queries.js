import {gql} from "@apollo/client";

// ** QUERIES ** //

const GET_ARTISTS = gql`
    query {
        artists {
            _id
            name
            dateFormed
            members
            numOfAlbums
            albums {
                _id
                title
                releaseDate
                genre
            }
        }
    }
`;

const GET_ARTISTS_BY_ID = gql`
    query getArtistById($id: String!) {
        getArtistById(_id: $id) {
            _id
            name
            dateFormed
            members
            numOfAlbums
            albums {
                _id
                title
                releaseDate
                genre
            }
        }
    }
`;

const GET_ALBUMS = gql`
    query {
        albums {
            _id
            genre
            releaseDate
            title
            songs {
                _id
                title
                duration
            }
            artist {
                _id
                name
            }
            recordCompany {
                _id
                name
            }
        }
    }
`;

const GET_ALBUMS_BY_ID = gql`
    query getAlbumById($id: String!) {
        getAlbumById(_id: $id) {
            _id
            genre
            releaseDate
            title
            songs {
                _id
                title
                duration
            }
            artist {
                _id
                name
            }
            recordCompany {
                _id
                name
            }
        }
    }
`;

const GET_RECORD_COMPANIES = gql`
    query recordCompanies {
        recordCompanies {
            _id
            name
            country
            foundedYear
            numOfAlbums
            albums {
                _id
                title
            }
        }
    }
`;

const GET_RECORD_COMPANIES_BY_ID = gql`
    query getCompanyById($id: String!) {
        getCompanyById(_id: $id) {
            _id
            name
            foundedYear
            country
            numOfAlbums
            albums {
                _id
                title
            }
        }
    }
`;

const COMPANY_BY_FOUNDED_YEAR = gql`
    query companyByFoundedYear($min: Int!, $max: Int!) {
        companyByFoundedYear(min: $min, max: $max) {
            _id
            name
            country
            foundedYear
            numOfAlbums
            albums {
                _id
                title
            }
        }
    }
`;

const ALBUMS_BY_GENRE = gql`
    query albumsByGenre($genre: MusicGenre!) {
        albumsByGenre(genre: $genre) {
            _id
            title
            genre
            releaseDate
            artist {
                _id
                name
            }
            recordCompany {
                _id
                name
            }
            songs {
                _id
                title
            }
        }
    }
`;

const SONGS_BY_ID = gql`
    query Query($id: String!) {
        getSongById(_id: $id) {
            _id
            title
            duration
            albumId {
                _id
                title
            }
        }
    }
`;

const SONGS_BY_ALBUM_ID = gql`
    query getSongsByAlbumId($id: String!) {
        getSongsByAlbumId(_id: $id) {
            _id
            title
            duration
            albumId {
                _id
                title
            }
        }
    }
`;

const SONGS_BY_ARTIST_ID = gql`
    query getSongsByArtistId($artistId: String!) {
        getSongsByArtistId(artistId: $artistId) {
            _id
            title
            duration
            albumId {
                _id
                title
            }
        }
    }
`;

const ARTIST_BY_ARTIST_NAME = gql`
    query searchArtistByArtistName($searchTerm: String!) {
        searchArtistByArtistName(searchTerm: $searchTerm) {
            _id
            name
            dateFormed
            members
            numOfAlbums
            albums {
                _id
                title
            }
        } 
    }
`;

const SONG_BY_TITLE = gql`
    query searchSongByTitle($searchTitleTerm: String!) {
        searchSongByTitle(searchTitleTerm: $searchTitleTerm) {
            _id
            title
            duration
            albumId {
                _id
                title
            }
        }
    }
`;

// ** MUTATIONS ** //

const ADD_ARTIST = gql`
    mutation addArtist($name: String!, $dateFormed: Date!, $members: [String!]!) {
        addArtist(name: $name, date_formed: $dateFormed, members: $members) {
            _id
            name
            dateFormed
            members
            numOfAlbums
            albums {
                _id
                title
            }
        }
    }
`;

const EDIT_ARTIST = gql`
    mutation editArtist($id: String!, $name: String, $dateFormed: Date, $members: [String!]) {
        editArtist(_id: $id, name: $name, date_formed: $dateFormed, members: $members) {
            _id
            name
            members
            dateFormed
            numOfAlbums
            albums {
                _id
                title
            }
        }
    }
`;

const DELETE_ARTIST = gql`
    mutation removeArtist($id: String!) {
        removeArtist(_id: $id) {
            _id
            name
            dateFormed
            members
            numOfAlbums
            albums {
                _id
                title
            }
        }
    }
`;

const ADD_ALBUM = gql`
    mutation addAlbum($title: String!, $releaseDate: Date!, $genre: MusicGenre!, $artistId: String!, $companyId: String!) {
        addAlbum(title: $title, releaseDate: $releaseDate, genre: $genre, artistId: $artistId, companyId: $companyId) {
            _id
            genre
            releaseDate
            title
            artist {
                _id
                name
            }
            recordCompany {
                _id
                name
            }
            songs {
                _id
                title
            }
        }
    }
`;

const EDIT_ALBUM = gql`
    mutation editAlbum($id: String!, $title: String, $releaseDate: Date, $genre: MusicGenre, $artistId: String, $companyId: String) {
        editAlbum(_id: $id, title: $title, releaseDate: $releaseDate, genre: $genre, artistId: $artistId, companyId: $companyId) {
            _id
            title
            genre
            releaseDate
            artist {
                _id
                name
            }
            recordCompany {
                _id
                name
            }
            songs {
                _id
                title
            }
        }
    }
`;

const DELETE_ALBUM = gql`
    mutation removeAlbum($id: String!) {
        removeAlbum(_id: $id) {
            _id
            title
            genre
            releaseDate
            artist {
                _id
                name
            }
            recordCompany {
                _id
                name
            }
            songs {
                _id
                title
            }
        }
    }
`;

const ADD_RECORD_COMPANY = gql`
    mutation addCompany($name: String!, $foundedYear: Int!, $country: String!) {
        addCompany(name: $name, founded_year: $foundedYear, country: $country) {
            _id
            country
            foundedYear
            name
            numOfAlbums
            albums {
                _id
                title
            }
        }
    }
`;

const EDIT_RECORD_COMPANY = gql`
    mutation editCompany($id: String!, $name: String, $foundedYear: Int, $country: String) {
        editCompany(_id: $id, name: $name, founded_year: $foundedYear, country: $country) {
            _id
            name
            country
            foundedYear
            numOfAlbums
            albums {
                _id
                title
            }
        }
    }
`;

const DELETE_RECORD_COMPANY = gql`
    mutation removeCompany($id: String!) {
        removeCompany(_id: $id) {
            _id
            name
            country
            foundedYear
            numOfAlbums
            albums {
                _id
                title
            }
        }
    }
`;

const ADD_SONG = gql`
    mutation addSong($title: String!, $duration: String!, $albumId: String!) {
        addSong(title: $title, duration: $duration, albumId: $albumId) {
            _id
            title
            duration
            albumId {
                _id
                title
            }
        }
    }
`;

const EDIT_SONG = gql`
    mutation editSong($id: String!, $title: String!, $duration: String!, $albumId: String!) {
        editSong(_id: $id, title: $title, duration: $duration, albumId: $albumId) {
            _id
            title
            duration
            albumId {
                _id
                title
            }
        }
    }
`;

const DELETE_SONG = gql`
    mutation removeSong($id: String!) {
        removeSong(_id: $id) {
            _id
            title
            duration
            albumId {
                _id
                title
            }
        }
    }
`;

let exported = {
    // ** QUERIES ** //
    GET_ARTISTS,
    GET_ALBUMS,
    GET_RECORD_COMPANIES,
    GET_ARTISTS_BY_ID,
    GET_ALBUMS_BY_ID,
    GET_RECORD_COMPANIES_BY_ID,
    COMPANY_BY_FOUNDED_YEAR,
    ALBUMS_BY_GENRE,
    SONGS_BY_ID,
    SONGS_BY_ARTIST_ID,
    SONGS_BY_ALBUM_ID,
    ARTIST_BY_ARTIST_NAME,
    SONG_BY_TITLE,
    // ** MUTATIONS ** //
    ADD_ARTIST,
    EDIT_ARTIST,
    DELETE_ARTIST,
    ADD_ALBUM,
    EDIT_ALBUM,
    DELETE_ALBUM,
    ADD_RECORD_COMPANY,
    EDIT_RECORD_COMPANY,
    DELETE_RECORD_COMPANY,
    ADD_SONG,
    EDIT_SONG,
    DELETE_SONG
};

export default exported;