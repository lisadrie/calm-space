const Civility = civility => ['Monsieur', 'Madame', 'Autre'].includes(civility);
const Names = name => /^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(name);
const Email = email => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
const Phone = phone => /^(\+33|0)[1-9](\d{2}){4}$/.test(phone);
const Birthdate = birthdate => {
    const date = new Date(birthdate);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return date instanceof Date && !isNaN(date) && age >= 13 && age <= 120;
};
const City = city => /^[a-zA-ZÀ-ÿ\s'-]{2,100}$/.test(city);
const Postcode = postcode => /^\d{5}$/.test(postcode);
const Pseudo = pseudo => /^[a-zA-Z0-9_-]{3,100}$/.test(pseudo);
const Password = password => /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password);

module.exports = { Civility, Names, Email, Phone, Birthdate, City, Postcode, Pseudo, Password };