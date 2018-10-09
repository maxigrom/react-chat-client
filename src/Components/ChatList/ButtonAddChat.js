// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  buttonAdd: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 4,
  },
});

type Props = {};

class ButtonAddChat extends React.Component<Props> {
  props: Props;

  render = () => {
    const { classes } = this.props;

    return (
      <Button variant='fab' color='primary' aria-label='Add' className={classes.buttonAdd}>
        <AddIcon />
      </Button>
    );
  };
}

export default withStyles(styles)(ButtonAddChat);
