import React, { Component } from 'react'
import {reduxForm} from 'redux-form'
import {
  PasswordField,
  ErrorBanner,
  SubmitIndicator
} from 'features/shared/components'
import { btmID } from 'utility/environment'
import { normalizeBTMAmountUnit } from 'utility/buildInOutDisplay'
import styles from './VoteConfirmModal.scss'
import {withNamespaces} from 'react-i18next'


class VoteConfirmModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      fields: { accountId, accountAlias, nodePubkey, amount, password, gasLevel },
      handleSubmit,
      submitting,
      cancel,
      error,
      gas,
      t,
      btmAmountUnit,
    } = this.props

    const fee = Number(gasLevel.value * gas)

    const  Total = Number(amount.value) + fee
    let submitLabel = t('transaction.vote.confirm')

    const normalize = (value) => {
      return normalizeBTMAmountUnit(btmID, value, btmAmountUnit)
    }

    return (
      <div>
        <h3>{ t('transaction.vote.confirm') }</h3>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.colLabel}>{ t('form.account') }</td>
              <td> <span>{accountAlias.value || accountId.value}</span></td>
            </tr>
            <tr>
              <td className={styles.colLabel}>{ t('transaction.vote.for') }</td>
              <td> <span>{nodePubkey.value}</span> </td>
            </tr>
            <tr>
              <td className={styles.colLabel}>{ t('transaction.vote.voteAmount') }</td>
              <td> <code>{normalize(amount.value)}</code> </td>
            </tr>

            <tr>
              <td className={styles.colLabel}>{t('form.fee')}</td>
              <td> <code>{normalize(fee)}</code> </td>
            </tr>

            <tr>
              <td className={styles.colLabel}>{t('transaction.normal.total')}</td>
              <td> <code>{normalize(Total)}</code> </td>
            </tr>
          </tbody>
        </table>

        <hr className={styles.hr}/>

        <form onSubmit={handleSubmit}>
          <div>
            <label>{t('key.password')}</label>
            <PasswordField
              placeholder={t('key.passwordPlaceholder')}
              fieldProps={password}
            />
          </div>

          {error && error.message === 'PasswordWrong' &&
          <ErrorBanner
            title={t('form.errorTitle')}
            error={t('errorMessage.password')} />}

          <div className={styles.btnGroup}>
            <div>
              <button type='submit' className='btn btn-primary'
                      disabled={submitting}>
                {submitLabel}
              </button>

              {submitting &&
              <SubmitIndicator className={styles.submitIndicator} />
              }
            </div>
            <button type='button'  className='btn btn-default' onClick={cancel}>
              <i/> {t('form.cancel')}
            </button>
          </div>
        </form>
      </div>
    )

  }
}

const validate = values => {
  const errors = {}
  if (!values.password) {
    errors.password = 'Required'
  }
  return errors
}

export default  withNamespaces('translations') (reduxForm({
  form: 'Vote',
  fields:[
    'accountAlias',
    'accountId',
    'nodePubkey',
    'amount',
    'gasLevel',
    'password'
  ],
  destroyOnUnmount: false,
  validate
})(VoteConfirmModal))