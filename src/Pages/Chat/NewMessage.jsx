// @flow
import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core';
import StyleConstants from '../../Consts/StyleConstants';
import type { TApiChat } from '../../Types/Api/TApiChat';
import Loading from '../../Components/Loading';

type Props = {
  loading?: boolean,
  activeChat: ?TApiChat,
  onSendMessage: (text: string) => void,

  classes?: Object,
};

type State = {
  inputValues: { [string]: ?string },
};

const styles = theme => ({
  newMessage: {
    position: 'fixed',
    top: 'auto',
    left: StyleConstants.DrawerWidth + theme.spacing.sm,
    bottom: theme.spacing.sm,
    right: theme.spacing.md,
    padding: theme.spacing.sm,
  },
});

class NewMessage extends React.Component<Props, State> {
  props: Props;

  state = {
    inputValues: {},
  };

  setCurrentMessage = (text: string) => {
    this.setState(prevState => ({
      inputValues: {
        ...prevState.inputValues,
        [this.props.activeChat._id]: text,
      },
    }));
  };

  handleOnChangeMessage = (e) => {
    this.setCurrentMessage(e.target.value);
  };

  handleOnSubmitMessage = (e) => {
    e.preventDefault();
    this.props.onSendMessage(this.state.inputValues[this.props.activeChat._id]);
    this.setCurrentMessage('');
  };

  render() {
    const { loading, activeChat, classes } = this.props;
    const { inputValues } = this.state;

    if (activeChat == null) return null;

    const value = inputValues[activeChat._id] || '';

    return (
      <Paper className={classes.newMessage} elevation={8}>
        <Loading loading={loading} />
        <form onSubmit={this.handleOnSubmitMessage}>
          <Input fullWidth placeholder="Type your message..." onChange={this.handleOnChangeMessage} value={value} />
        </form>
      </Paper>
    );
  }
}

export default withStyles(styles)(NewMessage);
