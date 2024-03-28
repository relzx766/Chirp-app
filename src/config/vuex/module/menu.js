export default {
    namespaced: true,
    state: {
        setting: {
            title: '设置',
            path: '/setting',
            children: {
                account: {
                    title: '你的账号',
                    path: '/setting/account',
                    placeholder: '查看你的账号信息',
                    children: {
                        password: {
                            title: '修改密码',
                            path: '/setting/account/password',
                            icon: 'bi-key',
                            placeholder: '修改你的账号密码'
                        }
                    }
                },
                chat: {
                    title: '私信',
                    path: '/setting/chat'
                }
            },

        }
    }
}