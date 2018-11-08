import React from 'react'
import {RestoreKeystore} from 'features/shared/components'
import {withNamespaces} from 'react-i18next'
import { Link } from 'react-router'
import {connect} from 'react-redux'
import actions from 'actions'
import styles from '../FormIndex.scss'

class Keystore extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const t = this.props.t

    return (
      <div className={styles.main}>
        <div>
          <h2 className={styles.title}>{t('backup.restoreKeystore')}</h2>
          <div className={styles.formWarpper}>
            <div className={styles.form}>
              <RestoreKeystore success={this.props.success}/>
              <Link
                className='btn btn-link'
                to='/initialization/'>
                cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default withNamespaces('translations') (connect(
  () => ({}),
  (dispatch) => ({
    success: () => dispatch(actions.initialization.initSucceeded()),
  })
)(Keystore))
