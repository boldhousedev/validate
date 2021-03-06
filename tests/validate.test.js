import v from '../lib/validate.esm.js';
import v8n from 'v8n-bd';

// simple
test('simple json > fullname sent > valid !', () => {
    var validations = { name: [[v8n().fullname(), 'Enter your fullname']] }
    var json = { name: 'someone name' }

    expect((v.validate(json, { validations })) === null).toBe(true);
});
test('simple json > first name sent > invalid !', () => {
    var validations = { name: [[v8n().fullname(), 'Enter your fullname']] }
    var json = { name: 'someone' }

    expect((v.validate(json, { validations })) === null).toBe(false);
});

// overriding validations
test('overriding validations !', () => {
    var validations = { name: [[v8n().fullname(), 'Enter your fullname']] }
    var overValidations = { name: [[v8n().minLength(5), '5 char needed']] }
    var json = { name: 'someone' }

    v.validations = validations;
    expect((v.validate(json, { validations: overValidations })) === null).toBe(true);
});

// automated nonempty validation
test('automated nonempty validation > fullname and age not sent > valid !', () => {
    var validations = { name: true, age: true }
    var json = {};
    var errors = v.validate(json, { validations });

    expect(typeof errors === 'object' && errors.length === 2).toBe(true);
});

// single complex 1
test('single complex 1 json > fullname and email sent > valid !', () => {
    var validations = { name: [], 'contacts[email]': [[v8n().email(), 'invalid email']] }
    var json = {
        name: 'someone name', contacts: {
            email: 'team@bd.org'
        }
    }

    expect((v.validate(json, { validations })) === null).toBe(true);
});

// single complex 2
test('single complex 2 json > fullname and email sent > valid !', () => {
    var validations = { name: [], 'contacts[email][home]': [[v8n().email(), 'invalid email']] }
    var json = {
        name: 'someone name', contacts: {
            email: { home: 'team@bd.org' }
        }
    }

    expect((v.validate(json, { validations })) === null).toBe(true);
});

// multiple
test('mix json > fullname and email sent > valid !', () => {
    var validations = { name: [], 'contacts[0][email]': [[v8n().email(), 'invalid email']] }
    var json = {
        name: 'someone name', contacts: [
            {
                email: 'team@bd.org'
            },
        ]
    }

    expect((v.validate(json, { validations })) === null).toBe(true);
});

// multiple 2
test('mix json 2 > partial validation with invalid email item on list sent > invalid !', () => {
    var validations = { name: [], 'contacts[][email]': [[v8n().email(), 'invalid email']] }
    var json = {
        name: 'someone name', contacts: [
            {
                email: 'team@bd.org'
            },
            {
                email: 'team@.org'
            }
        ]
    }
    delete json.contacts[0];
    var r = (v.validate(json, { validations }));
    expect(r !== null && r[0][2] === '1').toBe(true);
});

test('mix json 3 > fullname sent and email NOT sent > invalid !', () => {
    var validations = { name: [], 'contacts': [true], 'contacts[0][email]': [] }
    var json = {
        name: 'someone name', contacts: [
        ]
    }
    console.log('results', (v.validate(json, { validations })));
    expect((v.validate(json, { validations })) === null).toBe(false);
});

test('mix json 4 > fullname sent and one of two contact emails NOT sent > invalid !', () => {
    var validations = {
        name: [],
        'contacts[][email]': [[v8n().email(), 'Enter a valid email']]
    }
    var json = {
        name: 'someone name', contacts: [
            {
                //email: 'team@bd.org'
            },
            {
                email: 'admin@bd.org'
            },
        ]
    }

    expect((v.validate(json, { validations })) === null).toBe(false);
});

test('mix json 5 > fullname sent and two contact emails sent > valid !', () => {
    var validations = {
        name: [],
        'contacts[][email]': [[v8n().email(), 'Enter a valid email']]
    }
    var json = {
        name: 'someone name', contacts: [
            {
                email: 'team@bd.org'
            },
            {
                email: 'admin@bd.org'
            },
        ]
    }

    expect((v.validate(json, { validations })) === null).toBe(true);
});

test('mix json 6 > fullname, two emails, address sent correctly > valid !', () => {
    var validations = {
        name: [],
        'contacts[][email]': [[v8n().email(), 'Enter a valid email']],
        'address[][location][street]': [[v8n().string().minLength(1), 'Enter a valid address']],
    }
    var json = {
        name: 'someone name', contacts: [
            {
                email: 'team@bd.org'
            },
            {
                email: 'admin@bd.org'
            },
        ],
        address: [
            {
                zipcode: '099012123',
                num: '123',
                location: {
                    zipcode: '099012123',
                    street: 'lorem ipsum',
                }
            }
        ],
    }

    expect((v.validate(json, { validations })) === null).toBe(true);
});

test('mix json 7 > fullname, two emails, address sent without street > invalid !', () => {
    var validations = {
        name: [],
        'contacts[][email]': [[v8n().email(), 'Enter a valid email']],
        'address[][location][street]': [[v8n().string().minLength(1), 'Enter a valid address']],
    }
    var json = {
        name: 'someone name', contacts: [
            {
                email: 'team@bd.org'
            },
            {
                email: 'admin@bd.org'
            },
        ],
        address: [
            {
                zipcode: '099012123',
                num: '123',
                location: {
                    zipcode: '099012123',
                }
            }
        ],
    }

    expect((v.validate(json, { validations })) === null).toBe(false);
});
