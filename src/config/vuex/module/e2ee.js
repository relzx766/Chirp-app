import {e2eeMutations} from "@/config/vuex/mutation-types";
import {e2eeActions} from "@/config/vuex/action-types";
import {getKeyPair, getPublicKeys, savePublicKey} from "@/api/advice";
import {generateKey, getPrivateKey, mathPublicKey, setPrivateKey} from "@/util/encrypt";

export default {
    namespaced: true,
    state: {
            prime: '',
            generator: '',
            publicKeys: {
                /* userId:key */
            },
            privateKey: ''
    },
    mutations: {
        [e2eeMutations.SET_E2EE_PRIME](state, {prime}) {
            state.prime = prime;
        },
        [e2eeMutations.SET_E2EE_GENERATOR](state, {generator}) {
            state.generator = generator;
        },
        [e2eeMutations.SET_E2EE_PRIVATE_KEY](state, {privateKey}) {
            state.privateKey = privateKey;
        },
        [e2eeMutations.ADD_E2EE_PUBLIC_KEY](state, {id, publicKey}) {
            state.publicKeys[id] = publicKey;
        }
    },
    actions: {
        [e2eeActions.INIT_E2EE]({commit, rootState,dispatch}) {
            if (!getPrivateKey(rootState.user.id)){
                let privateKey=generateKey();
                setPrivateKey(rootState.user.id,privateKey);
                commit(e2eeMutations.SET_E2EE_PRIVATE_KEY, {privateKey});
            }
            return getKeyPair().then(r => {
                if (r.code === 200) {
                    let keypair = r.data.record;
                    let privateKey = getPrivateKey(rootState.user.id);
                    commit(e2eeMutations.SET_E2EE_PRIME, {prime: keypair.prime});
                    commit(e2eeMutations.SET_E2EE_GENERATOR, {generator: keypair.generator});
                    return dispatch(e2eeActions.SET_PRIVATE_KEY,{privateKey});
                } else {
                    throw new Error(r.message);
                }
            });
        },
        [e2eeActions.FETCH_PUBLIC_KEY]({commit}, {userIds}) {
            if (userIds.length>0) {
                return getPublicKeys(userIds).then(res => {
                    if (res.code === 200) {
                        let record = res.data.record;
                        Object.keys(record).forEach(id => {
                            commit(e2eeMutations.ADD_E2EE_PUBLIC_KEY, {id, publicKey: record[id]});
                        });
                    } else {
                        throw new Error(res.message);
                    }
                });
            }
        },
        [e2eeActions.UPLOAD_PUBLIC_KEY]({commit, state, rootState}) {
            let publicKey = mathPublicKey(state.generator, state.privateKey, state.prime);
            commit(e2eeMutations.ADD_E2EE_PUBLIC_KEY, {id: rootState.user.id, publicKey});
            return savePublicKey(publicKey).then(r => {
                if (r.code !== 200) {
                    throw new Error(r.message);
                }
            });
        },
        [e2eeActions.SET_PRIVATE_KEY]({commit, dispatch,rootState}, {privateKey}) {
            commit(e2eeMutations.SET_E2EE_PRIVATE_KEY, {privateKey});
            setPrivateKey(rootState.user.id,privateKey);
            return dispatch(e2eeActions.UPLOAD_PUBLIC_KEY);
        }
    }
}