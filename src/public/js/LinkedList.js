(() => {
  // Basic list node implementation containing 'data' and 'next' pointer
  // that keeps reference to the node on the ordered collection
  const ListNode = (data, next = null) => ({data, next});

  const LinkedList = (initialHead = null) => {
    // It's enough to keep reference of the 'head' node in order
    // to access all the nodes in the list
    let head = initialHead;

    const _insertAtBeginning = (data) => {
      // Create new node with the data that we want to keep on the list
      const newNode = ListNode(data);
      // Pointer 'next' should point to current head node
      newNode.next = head;
      // Head reference should now point to the new created node
      head = newNode;
      // Return head node
      return head;
    };

    const _insertAtEnd = (data) => {
      // Create new node with the data that we want to keep on the list
      const newNode = ListNode(data);

      if (!head) {
        head = newNode;
        return head;
      }
      // Tail node will be considered the node on which the 'next' pointer is null
      let tail = head;
      // We need to traverse all the nodes in the collection to find the 'tail'
      while (tail.next !== null) {
        tail = tail.next;
      }
      // Once tail node is found we need to assign its 'next' pointer to the new node
      tail.next = newNode;
      // Return head node
      return head;
    };

    const _getNodeAt = (index) => {
      // Keep track of the count of the nodes traversed
      let counter = 0;
      // Keep reference of current node that we are checking
      let node = head;
      while (node) {
        if (counter === index) {
          return node;
        }
        // Increment counter
        counter++;
        // Go to the next node in the collection
        node = node.next;
      }
      return null;
    };

    const _insertNodeAt = (data, index) => {
      if (!head) {
        head = ListNode(data);
        return head;
      }

      if (index === 0) {
        _insertAtBeginning(data);
      }

      // Get the previous node that we will need reference 'next' pointer to the new node
      const previousNode = _getNodeAt(index - 1);
      // In case node on the defined position it's not defined, we need to stop execution
      if (!previousNode) {
        return null;
      }
      // Create new node with 'next' pointer to the previous's 'next' pointing node 
      const newNode = ListNode(data, previousNode.next);
      // Update previous node to point to the new node
      previousNode.next = newNode;
      // Return head node
      return head;
    };

    const _deleteAtBeginning = (returnOld = false) => {
      if (head) {
        // Keep reference of old head node
        const oldHeadReference = head;
        // Replace head reference with 'next' pointer
        head = head.next;
        // Return head node
        return returnOld ? oldHeadReference : head;
      }
      return null;
    }

    const _deleteAtEnd = () => {
      if (!head) {
        // In case head node it's not defined we cannot delete any other node
        return null;
      }

      if (!head.next) {
        // In case there is none other node on the collection we need to remove header
        head = null;
        return head;
      }
      // Keep index of the current node that it's traversing
      let tailIndex = 0;
      // Move to the next node on the collection and find tail position
      let tail = head.next;
      while (tail.next !== null) {
        tailIndex++;
        tail = tail.next;
      }
      // Find previous node on the collection and change 'next' poinnter
      const previousNode = _getNodeAt(tailIndex - 1);
      previousNode.next = null;
      return head;
    }

    const _deleteNodeAt = (index) => {
      if (!head) {
        // In case we don't have head node the collection is empty
        return null;
      }
      if (index === 0) {
        // In case we are trying to remove the head node we can use pre-created method
        _deleteAtBeginning();
      }
      const previousNode = _getNodeAt(index - 1);
      const currentNode = _getNodeAt(index);
      // We should have both nodes valid to change related pointers
      if (!previousNode || !currentNode) {
        return;
      }
      previousNode.next = currentNode.next;
      // Return head node
      return head;
    };

    const _traverse = () => {
      const data = [];
      // Traverse down to all nodes in the collection
      let node = head;
      while (node) {
        data.push(node.data);
        node = node.next;
      }
      return data;
    }

    

    return {
      insertAtBeginning: _insertAtBeginning,
      insertAtEnd: _insertAtEnd,
      getNodeAt: _getNodeAt,
      insertNodeAt: _insertNodeAt,
      deleteAtBeginning: _deleteAtBeginning,
      deleteAtEnd: _deleteAtEnd,
      deleteNodeAt: _deleteNodeAt,
      traverse: _traverse,
      head: () => head
    }
  }

  window.LinkedList = LinkedList;
})();
