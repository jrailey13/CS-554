const exportedMethods = {
    // validId(id) {
    //     if (!id) return false;
    //     if (typeof id !== 'string') return false;
    //     id = id.trim();
    //     if (id.length === 0)
    //         return false;
    //     return ObjectId.isValid(id);
    // },
    validName(name) {
        if (name === null || typeof name !== "string" || name.trim() === "") {
            return false;
        }
        // Allow letters, spaces, numbers, and specified special characters
        if (!/^[a-zA-Z0-9\s!&\-$.]+$/.test(name.trim())) {
            return false;
        }
        return true;
    },
    validCompanyName(name) {
        if (name === null || typeof name !== "string" || name.trim() === "") {
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
            return false;
        }
        return true;
    },
    validTitle(title) {
        if (title === null) {
            return false;
        }
        if (
            typeof title !== "string" ||
            title.trim() === ""
        ) {
            return false;
        }
        return true;
    },
    validMembers(members) {
        if (Array.isArray(members)) {
            if (!members || members.length === 0) return false;

            for (let name of members) {
                if (name === null || typeof name !== "string" || name.trim() === "" || /\d/.test(name.trim())) {
                    return false;
                }
            }
            return true;
        }
        else if (typeof members === "string") {
            return !(/\d/.test(members.trim()));
        }
        else {
            return false;
        }
    },
    validSongs(songArray) {
        if (!songArray) return false;
        if (!Array.isArray(songArray)) return false;
        if (songArray.length === 0) return false;

        for (let name of songArray) {
            if (name === null) {
                return false;
            }
            if (
                typeof name !== "string" ||
                name.trim() === ""
            ) {
                return false;
            }
        }
        return true;
    },
    validDate(date) {
        if (!date) return false;
        if (typeof date !== "string") return false;
        if (date.trim() === "") return false;
        const regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
        if (!regex.test(date)) return false;


        // Validation inspired by https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
        // Parse the date parts to integers
        let parts = date.split("/");
        let day = parseInt(parts[1], 10);
        let month = parseInt(parts[0], 10);
        let year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if(year < 1900 || year > 2024 || month === 0 || month > 12)
            return false;

        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    },

    validFoundedYear(year) {
        if (!year) return false;
        if (!parseInt(year)) return false;
        if (!Number.isInteger(year)) return false;
        if (year < 1900 || year > 2024) return false;
        return true;
    },

    validCountry(country) {
        if (country === null) {
            return false;
        }
        if (
            typeof country !== "string" ||
            country.trim() === "" ||
            /\d/.test(country.trim())
        ) {
            return false;
        }
        return true;
    },

    validGenre(genre) {
        if (!genre) return false;
        if (typeof genre !== "string") return false;
        if (!genre.trim()) return false;

        const genreList = ["POP",
            "ROCK",
            "HIP_HOP",
            "COUNTRY",
            "JAZZ",
            "CLASSICAL",
            "ELECTRONIC",
            "R_AND_B",
            "INDIE",
            "ALTERNATIVE"]
        if (!genreList.includes(genre.toUpperCase())) {
            return false;
        }
        return true;
    },
    validDuration(duration) {
        if (!duration) return false;
        if (typeof duration !== "string") return false;
        if (duration.trim() === "") return false;

        const regex = /^([0-5]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!regex.test(duration)) return false;
        return true;
    }
}

export default exportedMethods;