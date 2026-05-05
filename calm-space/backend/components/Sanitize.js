const Civility = civility => civility.trim();
const Lastname = lastname => lastname.trim().toUpperCase();
const Firstname = firstname => {
    const trimmed = firstname.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};
const Email = email => email.trim().toLowerCase();
const Phone = phone => phone.trim().replace(/\s+/g, '');
const Birthdate = birthdate => birthdate;
const City = city => {
    const trimmed = city.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};
const Postcode = postcode => postcode.trim();
const Pseudo = pseudo => pseudo.trim();

module.exports = { Civility, Lastname, Firstname, Email, Phone, Birthdate, City, Postcode, Pseudo };