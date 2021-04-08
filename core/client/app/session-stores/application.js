import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';
import RSVP from 'rsvp';
import {inject as service} from '@ember/service';

// Ghost already uses a cookie to store it's session so we don't need to keep
// track of any other peristent login state separately in Ember Simple Auth
export default EphemeralStore.extend({
    session: service(),

    // when loading the app we want ESA to try fetching the currently logged
    // in user. This will succeed/fail depending on whether we have a valid
    // session cookie or not so we can use that as an indication of the session
    // being authenticated
    restore() {
        return this.session.user.then(() => {
            // provide the necessary data for internal-session to mark the
            // session as authenticated
            let data = {authenticated: {authenticator: 'authenticator:cookie'}};
            this.persist(data);
            return data;
        }).catch(() => {
            // ensure the session.user doesn't return the same rejected promise
            // after a succussful login
            this.session.notifyPropertyChange('user');
            return RSVP.reject();
        });
    }
});
