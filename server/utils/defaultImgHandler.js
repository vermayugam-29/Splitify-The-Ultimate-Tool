const generateDefault = (name) => {
    const [firstName , lastName] = name.split(' ');
    const initials = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
    return `https://via.placeholder.com/150?text=${initials}`;
}

module.exports = generateDefault;